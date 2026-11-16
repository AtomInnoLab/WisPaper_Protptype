# 项目开发记忆

- 合并 upstream 时，不要合并或提交 `build/`、`dist/` 等构建中间产物，以及 `node_modules/`、`vendor/` 等第三方库文件。
- 合并后检查 `git ls-files`，确保上述目录没有被跟踪；依赖锁文件可以保留，用于复现构建。
