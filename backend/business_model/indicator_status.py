import enum


class IndicatorStatus(enum.Enum):
    pending = 'pending'
    finished = 'finished'
    not_supported = 'not_supported'
