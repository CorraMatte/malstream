const colorBadge = {'low': 'success', 'medium': 'warning', 'high': 'danger'};

export const getColorBadgeByPriority = (sev) => colorBadge[sev];
