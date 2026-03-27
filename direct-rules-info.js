!(async () => {                                                                                                                                               
    try {                                                                                                                                                       
      let data = await httpAPI("/v1/rules", "GET");                                                                                                             
                                                                               
      $done({
        title: "Direct Rules [DEBUG]",
        content: "类型: " + typeof data + "\n\n" + JSON.stringify(data).substring(0, 500),
        icon: "ladybug",
        "icon-color": "#FF9500",
      });
    } catch (e) {
      $done({
        title: "Direct Rules [ERROR]",
        content: String(e),
        icon: "xmark.circle",
        "icon-color": "#FF3B30",
      });
    }
  })();

  function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve, reject) => {
      try {
        $httpAPI(method, path, body, (result) => {
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
