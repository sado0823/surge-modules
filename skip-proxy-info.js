!(async () => {
    let conf = await httpAPI("/v1/profiles/current?sensitive=0", "GET");
    let content = conf.profile || "";

    let skipMatch = content.match(/skip-proxy\s*=\s*(.+)/);
    let skips = skipMatch ? skipMatch[1].trim() : "未找到";
    let skipList = skips.split(/\s*,\s*/).join("\n");

    $done({
      title: "Skip Proxy",
      content: skipList,
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
