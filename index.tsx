import * as React from "react";
import { render } from "react-dom";
import unified from "unified";

import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import format from "rehype-format";
import html from "rehype-stringify";

function dig(node) {
  if (node.type === "element") {
    if (node.tagName === "table") {
      node.properties = {
        className: ["foo-class"]
      };
    }
    if (node.tagName === "a") {
      if (node.properties.href.match(/^http/)) {
        node.properties = {
          ...node.properties,
          target: "_blank",
          rel: "noopener"
        };
      }
    }
  }

  const { children } = node;
  if (children != null) {
    node.children.forEach(child => {
      dig(child);
    });
  }
}

function sample() {
  return node => {
    dig(node);
  };
}

class App extends React.Component {
  private traverse = async () => {
    const { contents } = await unified()
      .use(markdown)
      .use(remark2rehype)
      .use(sample as any)
      .use(format)
      .use(html).process(`
|a|b|
|:--|:--|
|a|b|

# adf

|a|b|
|:--|:--|
|a|b|

[spa link](/foo)
[ssr link](http://google.com)
      `);
    console.log(contents);
  };

  componentDidMount() {
    this.traverse();
  }

  render() {
    return <h1>hello</h1>;
  }
}

render(<App />, document.getElementById("app"));
