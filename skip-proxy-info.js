!(async () => {                                                                                                                                               
    try {                                                                      
      let conf = await httpAPI("/v1/profiles/current?sensitive=0", "GET");                                                                                      
      let content = conf.profile || "";                                        

      // skip-proxy
      let skipMatch = content.match(/skip-proxy\s*=\s*(.+)/);
      let skips = skipMatch ? skipMatch[1].trim() : "未找到";
      let skipList = skips.split(/\s*,\s*/).join("\n");

      // DIRECT 规则
      let rulesOutput = "";
      try {
        let data = await Promise.race([
          httpAPI("/v1/rules", "GET"),
          rejectAfter(3000),
        ]);

        let rules = [];
        if (Array.isArray(data)) rules = data;
        else if (data && Array.isArray(data.rules)) rules = data.rules;
        else {
          // 未知结构，显示所有 key
          rulesOutput = "\n\n【DEBUG】keys: " + Object.keys(data || {}).join(", ");
          throw "skip";
        }

        if (rules.length > 0) {
          // 显示第一条规则的完整结构
          rulesOutput =
            "\n\n【DEBUG 第1条规则】\n" +
            JSON.stringify(rules[0], null, 1);
        } else {
          rulesOutput = "\n\n【DIRECT 规则】数组为空";
        }
      } catch (e) {
        if (e !== "skip") rulesOutput = "\n\n【DIRECT 规则】" + String(e);
      }

      $done({
        title: "Skip Proxy",
        content: "【Skip Proxy】\n" + skipList + rulesOutput,
        icon: "arrow.right.circle",
        "icon-color": "#5AC8FA",
      });
    } catch (e) {
      $done({
        title: "Skip Proxy",
        content: "❌ " + String(e),
        icon: "xmark.circle",
        "icon-color": "#FF3B30",
      });
    }
  })();

  function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
      $httpAPI(method, path, body, (result) => {
        resolve(result);
      });
    });
  }

  function rejectAfter(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject("超时(" + ms + "ms)"), ms);
    });
  }
