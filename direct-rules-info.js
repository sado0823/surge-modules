  !(async () => {
    let data = await httpAPI("/v1/rules", "GET");

    let rules = [];
    if (Array.isArray(data)) {
      rules = data;
    } else if (data && Array.isArray(data.rules)) {
      rules = data.rules;
    }

    if (rules.length === 0) {
      $done({
        title: "Direct Rules",
        content: "⚠️  未解析到规则\nraw: " + JSON.stringify(data).substring(0, 200),
        icon: "xmark.circle",
        "icon-color": "#FF3B30",
      });
      return;
    }

    let directRules = rules.filter(
      (r) => (r.policy || r.proxy || "").toUpperCase() === "DIRECT"
    );

    let output;
    if (directRules.length === 0) {
      output = "无 DIRECT 规则";
    } else {
      output = directRules
        .map((r) => {
          let type = r.type || r.ruleType || "";
          let content = r.content || r.payload || r.value || "";
          return type + "," + content;
        })
        .join("\n");
      output = "共 " + directRules.length + " 条\n\n" + output;
    }

    $done({
      title: "Direct Rules",
      content: output,
      icon: "checkmark.shield",
      "icon-color": "#34C759",
    });
  })();

  function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
      $httpAPI(method, path, body, (result) => {
        resolve(result);
      });
    });
  }
