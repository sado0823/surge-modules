!(async () => {
    let conf = await httpAPI("/v1/profiles/current?sensitive=0", "GET");
    let content = conf.profile || "";

    let match = content.match(/skip-proxy\s*=\s*(.+)/);
    let skips = match ? match[1].trim() : "未找到";

    let list = skips.split(/\s*,\s*/).join("\n");

    $done({
      title: "Skip Proxy",
      content: list,
      icon: "arrow.right.circle",
      "icon-color": "#5AC8FA"
    });
  })();

  function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
      $httpAPI(method, path, body, (result) => {
        resolve(result);
      });
    });
  }
