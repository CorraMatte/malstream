from backend.business_model.result_status import ResultStatus


class ElasticQueries:
    @classmethod
    def get_finished_task_query(cls) -> dict:
        return {
            "query": {
                "bool": {
                    "should": [
                        {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "sandbox": True
                                        }
                                    },
                                    {
                                        "match": {
                                            "enrichment": True
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "is_supported_by_sandbox": False
                                        }
                                    },
                                    {
                                        "match": {
                                            "enrichment": True
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    "minimum_should_match": 1
                }
            }
        }

    @classmethod
    def get_pending_task_query(cls) -> dict:
        return {
            "query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "enrichment": False
                            }
                        },
                        {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "sandbox": False
                                        }
                                    },
                                    {
                                        "match": {
                                            "is_supported_by_sandbox": True
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    "minimum_should_match": 1
                }
            }
        }

    @classmethod
    def get_pending_not_supported_task_query(cls) -> dict:
        return {
            "query": {
                "match": {
                    "is_supported_by_sandbox": False
                }
            }
        }

    @classmethod
    def get_last_analyzed_files_with_interval(cls, interval: str) -> dict:
        return {
            "query": {
                "bool": {
                    "should": [
                        {
                            "bool": {
                                "must": [
                                    {
                                        "range": {
                                            "enrichment_dt": {
                                                "gte": f"now-{interval}"
                                            }
                                        }
                                    },
                                    {
                                        "range": {
                                            "sandbox_dt": {
                                                "gte": f"now-{interval}"
                                            }
                                        }
                                    },
                                    {
                                        "match": {
                                            "is_supported_by_sandbox": True
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "bool": {
                                "must": [
                                    {
                                        "range": {
                                            "enrichment_dt": {
                                                "gte": f"now-{interval}"
                                            }
                                        }
                                    },
                                    {
                                        "match": {
                                            "is_supported_by_sandbox": False
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }

    @classmethod
    def get_results_query_by_result_status(cls, result_status: ResultStatus) -> dict:
        if result_status == ResultStatus.pending:
            return cls.get_pending_task_query()
        elif result_status == ResultStatus.finished:
            return cls.get_finished_task_query()
        else:
            return {'query': {'match_all': {}}}
