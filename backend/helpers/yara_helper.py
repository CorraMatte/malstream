import yara


class YaraHelper:

    @classmethod
    async def is_yara_valid(cls, body: str) -> bool:
        try:
            yara.compile(source=body)
            return True
        except yara.Error:
            return False
