!(async () => {
    const moduleUrl =
      "https://raw.githubusercontent.com/sado0823/surge-modules/main/skip-proxy.sgmodule";

    let [conf, moduleText] = await Promise.all([
      httpAPI("/v1/profiles/current?sensitive=0", "GET"),
      fetchText(moduleUrl),
    ]);

    // 从当前 profile 提取完整 skip-proxy
    let content = conf.profile || "";
    let skipMatch = content.match(/skip-proxy\s*=\s*(.+)/);
    let skips = skipMatch ? skipMatch[1].trim() : "未找到";
    let skipList = skips.split(/\s*,\s*/).join("\n");

    // 从模块文件提取 [Rule] 部分
    let ruleSection = moduleText.match(/\[Rule\]([\s\S]*?)(?=\[|$)/);
    let rules = ruleSection
      ? ruleSection[1]
          .trim()
          .split("\n")
          .filter((l) => l.trim())
          .join("\n")
      : "未找到";

    let output =
      "【Skip Proxy】\n" + skipList + "\n\n【模块 DIRECT 规则】\n" + rules;

    $done({
      title: "Skip Proxy",
      content: output,
      icon: "arrow.right.circle",
      "icon-color": "#5AC8FA",
    });
  })();

  function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
      $httpAPI(method, path, body, (result) => {
        resolve(result);
      });
    });
  }

  function fetchText(url) {
    return new Promise((resolve) => {
      $httpClient.get(url, (err, resp, body) => {
        resolve(body || "");
      });
    });
  }
