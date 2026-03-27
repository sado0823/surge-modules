  !(async () => {                                                                                                                                               
    let conf = await httpAPI("/v1/profiles/current?sensitive=0", "GET");      
    let content = conf.profile || "";                                                                                                                           
                                                                               
    // skip-proxy
    let skipMatch = content.match(/skip-proxy\s*=\s*(.+)/);
    let skips = skipMatch ? skipMatch[1].trim() : "未找到";
    let skipList = skips.split(/\s*,\s*/).join("\n");

    // 所有 DIRECT 规则
    let directRules = content
      .split("\n")
      .filter((l) => l.trim().endsWith(",DIRECT"))
      .map((l) => l.trim());
    let rulesOutput = directRules.length > 0 ? directRules.join("\n") : "未找到";

    let output =
      "【Skip Proxy】\n" + skipList + "\n\n【DIRECT 规则】\n" + rulesOutput;

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
