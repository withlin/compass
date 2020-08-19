import G6 from "@antv/g6";

G6.registerEdge("hvh", {
  draw(cfg, group) {
    return this.drawShape(cfg, group);
  },
  drawShape(cfg: any, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    const shape = group.addShape("path", {
      attrs: {
        stroke: "#959DA5",
        lineWidth: 3,
        path: [
          ["M", startPoint.x, startPoint.y],
          ["L", endPoint.x / 3 + (2 / 3) * startPoint.x + 50, startPoint.y],
          ["L", endPoint.x / 3 + (2 / 3) * startPoint.x + 50, endPoint.y],
          ["L", endPoint.x + 50, endPoint.y],
        ],
      },
    });

    return shape;
  },
});

function drawPipeline(cfg: any, group: any): any {
  const shape = drawBase(cfg, group);
  drawPendding(cfg, group);
  drawProgress(cfg, group);
  drawSucceeded(cfg, group);
  drawFailedStaus(cfg, group);
  drawPendingStatus(cfg, group);
  drawCancelStatus(cfg, group);
  drawTime(cfg, group);
  drawTaskRunCancelled(cfg, group);
  return shape;
}

//drawBase draw base shape :4shape
function drawBase(cfg: any, group: any): any {
  const r = 5;

  const shape = group.addShape("rect", {
    attrs: {
      x: 2,
      y: 2,
      width: 180,
      height: 41,
      lineWidth: 2,
      radius: r,
      fill: "#fff",
    },
    name: "main-box",
    draggable: true,
  });

  group.addShape("rect", {
    attrs: {
      x: 0,
      y: 0,
      width: 179,
      height: 40,
    },
    draggable: true,
  });

  // 标题
  group.addShape("text", {
    attrs: {
      y: 20,
      x: 5,
      height: 16,
      width: 16,
      text: cfg.taskName,
      style: {
        fontWeight: 900,
      },
      fill: "black",
    },
    name: "title",
  });

  group.addShape("image", {
    attrs: {
      x: 140,
      y: 10,
      width: 25,
      height: 25,
      img:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAYAAAAuqZsAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARMSURBVFhHvZjNbtRWFMct8QSFN6AvQHkB4AnaFyjddQtblhGrgJAqtUsqwaZQsQKEIBILEBCgixaQCERBSQhQSOZ7Mh+Zmcwc/DvJsa5v7jieqdMr/SWPfT5+Pufea3siCYzRaKQaDoeyvb0tg8FA+v2+9Ho92drakm6sTrcr3VidTiclPce12AZbfPAlBrGIafGzxh4wF8oFIhFJ/y235MZfFfnp9w9y6uKKfDfzTg79vKDimHNcwwZbfPB1AfPApcAMyKpkQFTi2VJdfvjtfQKRV/jgq9XcBfSrFxoJmAvFndEGWvLmY1MrEEo6iYhBLGISmxxZcAq2Byq+K+7wz+dlOXzmbTDRNCLW3KuaxiZHFlw0DurSvfVg8CJE7P3gFGwP1NxGMGCRIocPB4vBRZAyGXVOxYa0LxToIJS0Nc7trlYFs9XHpFz40Ch0Tu0ncpGT3LZaDS6ijCzjdrstp6dYfd+eW5KZWyUVxyGbLJGT3DC4LY20WnE55xerQcdxAuLKk5qWvd4ZqhicmxSQ3DC4VYsgbbVa8v2vq0EnXyS99aKpEFuDkczeK8mRs4uqmdsbUwGSGwar2g5Y3N+PG82gg69f7lc0KckfLLak0R1Krb2tbQQMGx8QHz9OSJubm/r4omq0M6K/13OsxLnXrbj3EgO15ehuJVwIHxAbbPHB140VEgyw2AqNKOGPl9eCxq6eLHVkrdLXKmRVaaeabbVhvFvvqa8fzxcMbjsjSnjywkrQ2NXDOBli3lyd35n0LiCavVuWbn+nhbdfNtUWYPxCMV3BAAtbh4I1m83Uq8s4GZj9dgHbvZGKwTl30ucFgwEWm2cKFjL05YOZgPjSGKhcIFNeMASLbRtR4z+CIeYUCl2bBAyWFNixKVrpqggwGFJglG+SyR+6VgQYDKlW8iPPdnHzn6a8WOsmW4SrcWDYch5f/5ovGGBJJj9L9NqzUtDY1fHzy8GNFPlgXMMGW3zwtWvjBENqu2BTe/+5FjT25W4RLqCBuUAMf+vIUq1eT2+wPAaYdHkf4sgHXC33VdMAIXLDkHok0VNK+PhtvoetKxeQMSmQidwwpB7i9tpTbzRyLYKiRU5yu23U1x4IWaKsiFerVfnmf3y1Jhc53W0ieVGEEFKba9eeHvwXkunO36Vkblm1kldrCLVqu3ONsl68+yUYqEiRg1y2RbjVUjAOOGGfbxiydA8SjtjkUKg4Z/DzjQPKRxntg5ee40hbi5xzxKJ9xLZ5NfaDlwNIfThr68vlciGrlRjEStrnQbnVYmT+qUIAJme1VpNHC6WJNmETPvgSg1h5oBj7/g3FiqHs3CnBVz5V5I/5da3Aidnl1CsTx5zjGjaVSkV98CUGsYhJ7CwoRu4/7tgArYLMERJWq1UVAAqx+5tr2FiF8CUGsWz1ZUExUmAMDA2QANyZAfLI4K4NkiogAJD9Nhjdn2IfAyKWu/rGQYmIfAXuNFIXGDKDxgAAAABJRU5ErkJggg==",
    },
    name: "image-shape",
  });
  return shape;
}

function drawStatus(group: any, color: string, name: string) {
  group.addShape("circle", {
    attrs: {
      x: 20,
      y: 33,
      r: 3.5,
      fill: color,
    },
    name: name,
  });
}

function drawTaskRunTimeout(cfg: any, group: any) {
  if (cfg.status === "TaskRunTimeout") {
    // set status
    drawStatus(group, "#f02b2b", "timeout");

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "TimeOut.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawProgress draw progress status: 2shape
function drawTaskRunCancelled(cfg: any, group: any) {
  if (cfg.status === "TaskRunCancelled") {
    // set status
    drawStatus(group, "#3296fa", "cancel");

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Cancel.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawProgress draw progress status: 2shape
function drawProgress(cfg: any, group: any) {
  if (cfg.status === "Running") {
    // set status
    drawStatus(group, "#20d867", "running");

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Running.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }

  if (cfg.status === "Progress") {
    // status for image
    group.addShape("circle", {
      attrs: {
        x: 13,
        y: 32,
        r: 5,
        fill: "#ea9518",
      },
      name: "image-shape",
    });

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "In progress.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawPending
function drawPendding(cfg: any, group: any) {
  if (cfg.status === "Pendding") {
    // set status
    drawStatus(group, "#ffc12f", "pendding");
    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Pendding.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawSucceeded draw succeeded status: 2shape
function drawSucceeded(cfg: any, group: any) {
  if (cfg.status === "Succeeded") {
    // status for image
    group.addShape("image", {
      attrs: {
        x: 6,
        y: 25,
        width: 18,
        height: 18,
        img:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGSSURBVEhL7ZFLSwJRGIb7PwVREfQDKrRQutIiohIKKlu0iIgW7YOiP9DeMgLRvCUVWmAJkUFQVBQaXTXLyzg6zrydM3OwaLRUaOczu/N985z3O18N/omqOE9VnKdisUS+pJDCyes5PjIJiJLEKgoViamUynbCBxhwT8Ny6wEnpFlVoWwxlcazSbjCXrRbh1G3rkG/awovXJR1KJQtpsnsoX20EWmtSYNW6xDOopfIigLrUChLzIsZeWytbZQk1aJj24Bg5AKClGMdX6jEoiQiwscw71+SF5PO8fI5n8vAfOOA3jGO+o1O9JHx/U+nJGlWrv9EJY5l4lgJrqFlq5e8nRHehwDe+HeYrmzocU6iwazDoGeGnB/nLy2ESkybfY8BaMi4NBmVLBwtk4RGNJr1GNmdhef+ECmBY38URiWmW0+RBVnuPNDZx+SEzZtdaCJSw94cXCEfktkU6y5O0eXRRdE37XZOyEkVqReJEqSUomIKXZjp2obFwCrcYV/JUsqvYgqVP3ORksb/zp/iSqmKGcAncmSXV+WwdxEAAAAASUVORK5CYII=",
      },
      name: "image-shape",
    });

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Succeed.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawFailedStaus draw failed status: 2shape
function drawFailedStaus(cfg: any, group: any) {
  if (cfg.status === "Failed") {
    // status for image
    group.addShape("image", {
      attrs: {
        x: 8,
        y: 25,
        width: 15,
        height: 15,
        img:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADESURBVDhP7ZI9CgIxEEY9jBdYe93en1ovaWFr4QWEBYUV72AhCnbCmBd2Fk0yKwFtxAeB2czw8jFsTz7EX/Se74luh6PcL9fmK4YeMyGRaNsvpJ4tkjLu6DETEolOy5Uf3JeTl5epuaPHTEhyRyqrBiMv4FBbEjCXfV5vpCqGXuCPq7mzMEWgybqSKN2JmiSaLDtRuyMnaHfk6qwdqWRXjr1AoebOkkUiBuvp3P6PXI+ZkEjEyymJQu85qWIuO5efFYk8AGssmC7B7olJAAAAAElFTkSuQmCC",
      },
      name: "image-shape",
    });

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Failed.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawPendingStatus draw pending status: 2shape
function drawPendingStatus(cfg: any, group: any) {
  if (cfg.status === "Pending") {
    // status for image
    drawStatus(group, "#ffc12f", "pendding");

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Pending.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawCancelStatus draw cancel status: 2shape
function drawCancelStatus(cfg: any, group: any) {
  if (cfg.status === "Cancel") {
    // status for image
    group.addShape("circle", {
      attrs: {
        x: 13,
        y: 32,
        r: 5,
        fill: "#ea9518",
      },
      name: "image-shape",
    });

    //status for text
    group.addShape("text", {
      attrs: {
        y: 40,
        x: 25,
        height: 16,
        width: 16,
        text: "Cancel.",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

//drawTime draw the time : 2shape
function drawTime(cfg: any, group: any) {
  if (cfg.showtime) {
    //time for image
    group.addShape("image", {
      attrs: {
        x: 90,
        y: 28,
        width: 15,
        height: 15,
        img:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF4SURBVEhL7ZQ9S8MxEIf9mI7iVtGlCh18AYWiQ1F0sIIuHVxU0KEIDoLg4CCCi4ib4iCoa11PnjQHeWsSwW594Gi43OWX/901UzJmJgJFigI3t3cyPdPwDF8tRYHXt3c5Pe/L/OKyMdb4aqkq0efXt7TW2sZY/4VIYP+wJ2cXfRkMfszv7FwzKtHC0orZA76os3dg1ikigfXNbXOIHqxluX94NKblcmNaq22bHRMJUAKT3GjK5dW19cawRwyxubIlS0RSblLYo4Q6Yb3jE7sT4wno7Tu7Xevx4dDu0fAClAuIzX2FJ6A3Cm9PMo2kuezzlYrmqGCIJ0ADCQ7nnBLgx8KGEouf3BRJgafnF+sZon7MvT0QWy2gwanp0TGlDy7Epi6leAJAMLUOD0pBDLGMa5qPWECbxrSUqBnpSAA0cWNrJ/mw4eNdIibsSUhSAGia/lMpA2Pqjip7oxrrMlIAmH9GlPeJAzHW+HLPg0tW4D+YCBQZs4DIL0rDBl0skTbvAAAAAElFTkSuQmCC",
      },
      name: "image-shape",
    });
    //time for text
    group.addShape("text", {
      attrs: {
        y: 42,
        x: 103,
        text: cfg.time ?? "0s",
        fill: "gray",
        fontSize: 10,
      },
      name: "title",
    });
  }
}

G6.registerNode("card-node", {
  drawShape: function drawShape(cfg: any, group: any) {
    const color = cfg.error ? "#F4664A" : "#30BF78";
    const shape = drawPipeline(cfg, group);
    return shape;
  },
  setState(name: any, value: any, item: any) {
    const group = item.getContainer();
    if (name === "time" && value) {
      let shape = group.get("children")[7];
      shape.attr({ text: value });
    }
    if (name === "hover" && value) {
      const lightColor = "lightblue";
      const collapsed = true;
      const rectConfig = {
        lineWidth: 1,
        fontSize: 12,
        fill: "#fff",
        radius: 24,
        stroke: lightColor,
        opacity: 1,
      };

      group.addShape("circle", {
        name: "test",
        attrs: {
          x: 192,
          y: 25,
          r: 8,
          stroke: lightColor,
          fill: collapsed ? lightColor : "",
          isCollapseShape: true,
        },
      });

      group.addShape("text", {
        name: "right-plus",
        attrs: {
          x: 192,
          y: 25,
          width: 20,
          height: 20,
          textAlign: "center",
          textBaseline: "middle",
          text: collapsed ? "+" : "-",
          fontSize: 10,
          fill: collapsed ? "#00000" : lightColor,
          cursor: "pointer",
          isCollapseShape: true,
        },
      });

      group.addShape("circle", {
        name: "test",
        attrs: {
          x: 90,
          y: 53,
          r: 8,
          stroke: lightColor,
          fill: collapsed ? lightColor : "",
          isCollapseShape: true,
        },
      });
      group.addShape("text", {
        name: "bottom-plus",
        attrs: {
          x: 90,
          y: 53,
          width: 16,
          height: 16,
          textAlign: "center",
          textBaseline: "middle",
          text: collapsed ? "+" : "-",
          fontSize: 10,
          fill: collapsed ? "#00000" : lightColor,
          cursor: "pointer",
          isCollapseShape: true,
        },
      });
    }

    if (name === "hover" && !value) {
      const shape = group.get("children");
      console.log(shape);
      setTimeout(() => {
        group.removeChild(group.get("children")[shape.length - 2]);
        group.removeChild(group.get("children")[shape.length - 1]);
      }, 100);
      setTimeout(() => {
        group.removeChild(group.get("children")[shape.length - 2]);
        group.removeChild(group.get("children")[shape.length - 1]);
      }, 100);
    }

    if (name === "click") {
      let shape = group.get("children")[2];
      shape.attr({ text: value });
    }

    if (name === "Running") {
      const shapestatus = group.get("children")[4];
      const shapeText = group.get("children")[5];
      shapestatus.attr({
        fill: "#20d867",
      });

      shapeText.attr({
        text: "Running. ",
        fontStyle: "",
      });
    }

    if (name === "Pendding") {
      const shapestatus = group.get("children")[4];
      const shapeText = group.get("children")[5];
      shapestatus.attr({
        fill: "#ffc12f",
      });

      shapeText.attr({
        text: "Pendding. ",
        fontStyle: "",
      });
    }

    if (name === "Succeeded") {
      const shapeImg = group.get("children")[4];
      const shapeText = group.get("children")[5];
      shapeImg.attr({
        img:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGSSURBVEhL7ZFLSwJRGIb7PwVREfQDKrRQutIiohIKKlu0iIgW7YOiP9DeMgLRvCUVWmAJkUFQVBQaXTXLyzg6zrydM3OwaLRUaOczu/N985z3O18N/omqOE9VnKdisUS+pJDCyes5PjIJiJLEKgoViamUynbCBxhwT8Ny6wEnpFlVoWwxlcazSbjCXrRbh1G3rkG/awovXJR1KJQtpsnsoX20EWmtSYNW6xDOopfIigLrUChLzIsZeWytbZQk1aJj24Bg5AKClGMdX6jEoiQiwscw71+SF5PO8fI5n8vAfOOA3jGO+o1O9JHx/U+nJGlWrv9EJY5l4lgJrqFlq5e8nRHehwDe+HeYrmzocU6iwazDoGeGnB/nLy2ESkybfY8BaMi4NBmVLBwtk4RGNJr1GNmdhef+ECmBY38URiWmW0+RBVnuPNDZx+SEzZtdaCJSw94cXCEfktkU6y5O0eXRRdE37XZOyEkVqReJEqSUomIKXZjp2obFwCrcYV/JUsqvYgqVP3ORksb/zp/iSqmKGcAncmSXV+WwdxEAAAAASUVORK5CYII=",
      });

      shapeText.attr({
        text: "Succeed. ",
        fontStyle: "",
      });
    }
    if (name === "Failed") {
      const shapeImg = group.get("children")[4];
      const shapeText = group.get("children")[5];
      shapeImg.attr({
        img:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADESURBVDhP7ZI9CgIxEEY9jBdYe93en1ovaWFr4QWEBYUV72AhCnbCmBd2Fk0yKwFtxAeB2czw8jFsTz7EX/Se74luh6PcL9fmK4YeMyGRaNsvpJ4tkjLu6DETEolOy5Uf3JeTl5epuaPHTEhyRyqrBiMv4FBbEjCXfV5vpCqGXuCPq7mzMEWgybqSKN2JmiSaLDtRuyMnaHfk6qwdqWRXjr1AoebOkkUiBuvp3P6PXI+ZkEjEyymJQu85qWIuO5efFYk8AGssmC7B7olJAAAAAElFTkSuQmCC",
      });
      shapeText.attr({
        text: "Failed. ",
        fontStyle: "",
      });
    }

    if (name === "TaskRunCancelled") {
      const shapestatus = group.get("children")[4];
      const shapeText = group.get("children")[5];
      shapestatus.attr({
        fill: "#3296fa",
      });

      shapeText.attr({
        text: "Cancel. ",
        fontStyle: "",
      });
    }

    if (name === "TaskRunTimeout") {
      const shapestatus = group.get("children")[4];
      const shapeText = group.get("children")[5];
      shapestatus.attr({
        fill: "#f02b2b",
      });

      shapeText.attr({
        text: "Cancel. ",
        fontStyle: "",
      });
    }
  },
});
