"""
ForensicGraphSAGE Link Scorer — matches the trained gnn_link_scorer.pt checkpoint.
Actual architecture (from inspecting state_dict shapes):
  conv1: SAGELayer(in=183, out=64)
  conv2: SAGELayer(in=64,  out=2)   ← binary link classifier (linked / not-linked)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class SAGELayer(nn.Module):
    """Single GraphSAGE layer: h = lin_l(mean_aggregation) + lin_r(self_feature)."""

    def __init__(self, in_dim: int, out_dim: int):
        super().__init__()
        self.lin_l = nn.Linear(in_dim, out_dim)
        self.lin_r = nn.Linear(in_dim, out_dim, bias=False)

    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        src, dst = edge_index[0], edge_index[1]

        agg = torch.zeros_like(x)
        agg.index_add_(0, dst, x[src])

        deg = torch.zeros(x.size(0), 1, device=x.device)
        deg.index_add_(0, dst, torch.ones(src.size(0), 1, device=x.device))
        agg = agg / deg.clamp(min=1.0)

        return self.lin_l(agg) + self.lin_r(x)


class ForensicGraphSAGELinkScorer(nn.Module):
    """
    2-layer GraphSAGE binary link classifier trained on forensic cross-modal evidence.
    Input : 183-dim node feature vector (temporal, geo, network, financial, identity).
    Output: 2-dim logits [score_not_linked, score_linked].
    Link probability = softmax(logits)[1].
    """

    def __init__(self, in_features: int = 183, hidden_dim: int = 64, num_classes: int = 2):
        super().__init__()
        self.conv1 = SAGELayer(in_features, hidden_dim)
        self.conv2 = SAGELayer(hidden_dim, num_classes)

    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        h = F.relu(self.conv1(x, edge_index))
        logits = self.conv2(h, edge_index)
        return logits

    def predict_link_proba(self, logits_src: torch.Tensor, logits_dst: torch.Tensor) -> float:
        """Average softmax probability of class-1 (linked) across both endpoint nodes."""
        p_src = float(F.softmax(logits_src.detach(), dim=-1)[1])
        p_dst = float(F.softmax(logits_dst.detach(), dim=-1)[1])
        return round((p_src + p_dst) / 2.0, 4)
