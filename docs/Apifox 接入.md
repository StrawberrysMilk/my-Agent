# Apifox 接入

后端使用 Fastify 路由 schema 生成 OpenAPI 文档。添加或修改接口时，在路由上维护 `schema`，Swagger UI 和 OpenAPI JSON 会从同一份定义更新。

## 本地查看与导入

先在项目根目录运行 `pnpm dev`，然后：

- 浏览器文档页：<http://localhost:3000/docs>
- OpenAPI JSON：<http://localhost:3000/docs/json>
- OpenAPI YAML：<http://localhost:3000/docs/yaml>

在 Apifox 选择导入 OpenAPI/Swagger 文档，使用 URL 导入并填写 `http://localhost:3000/docs/json`。当前接口服务只在本机运行时，这个地址需要由运行 Apifox 的同一台电脑访问。

## 后续同步

新接口完成后，先确认 Swagger UI 中出现了该接口，再在 Apifox 的项目导入设置中对这个 OpenAPI 地址执行同步/更新。具体菜单名称可能随 Apifox 版本变化。若 Apifox 无法访问本地地址，可以导出 `/docs/json` 的内容为文件，再使用文件导入；部署到可访问环境后，也可以改用该环境的文档地址。

接口路由本身仍由开发者手动编写；OpenAPI 插件负责读取路由 schema 并生成文档，不会自动生成接口业务逻辑。
