import { onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { glob as globalStyle } from "solid-styled-components";

import TreeView from "../../"; // -> package.json -> module -> src/TreeView.jsx
import pkg from "../../package.json";

// TODO better way to define style?
var globalStyleString = "";
// we need `node.classList.toggle('expand')`
// but we dont care about the exact class name
var className = 'linux-find';
globalStyleString += `
  .${className}.tree-view.root { margin-left: 1px; margin-right: 1px; }
  .${className}.tree-view.root { height: 100%; /* fit to container */; overflow: auto; /* scroll on demand */ }
  .${className}.tree-view { text-align: left; }
  .${className}.tree-view,
  .${className}.tree-view ul { list-style: none; padding: 0; }
  .${className}.tree-view li { white-space: pre; /* dont wrap on x overflow. TODO fix width on overflow */ }
  .${className}.tree-view li.branch > span { color: blue; font-family: monospace; }
  .${className}.tree-view li.branch > ul { display: none; /* default collapsed */ }
  .${className}.tree-view li.branch.expanded { outline: solid 1px grey; }
  .${className}.tree-view li.branch.expanded > ul { display: block; }
  .${className}.tree-view li.empty { font-style: italic; }
  .${className}.tree-view span.link-source { color: green; }
  .${className}.tree-view span.link-source,
  .${className}.tree-view div.branch-label,
  .${className}.tree-view span.file,
  .${className}.tree-view span.name,
  .${className}.tree-view span.prefix { font-family: monospace; cursor: pointer; }
  /* .${className}.tree-view span.prefix { opacity: 0.6; } */ /* this looks worse than expected */
`;

var className = 'file-tree';
globalStyleString += `
  .${className}.tree-view.root { margin-left: 1px; margin-right: 1px; }
  .${className}.tree-view.root { height: 100%; /* fit to container */; overflow: auto; /* scroll on demand */ }
  .${className}.tree-view { text-align: left; }
  .${className}.tree-view,
  .${className}.tree-view ul { list-style: none; padding: 0; }
  .${className}.tree-view ul { padding-left: 0.5em; margin-left: 0.5em; border-left: solid 1px grey; }
  .${className}.tree-view li { white-space: pre; /* dont wrap on x overflow. TODO fix width on overflow */ }
  .${className}.tree-view li.branch > span { color: blue; font-family: monospace; }
  .${className}.tree-view li.branch > ul { display: none; /* default collapsed */ }
  .${className}.tree-view li.branch.expanded {  }
  .${className}.tree-view li.branch.expanded > ul { display: block; }
  .${className}.tree-view li.empty { font-style: italic; }
  .${className}.tree-view span.link-source { color: green; }
  .${className}.tree-view span.link-source,
  .${className}.tree-view div.branch-label,
  .${className}.tree-view span.file,
  .${className}.tree-view span.name { font-family: monospace; cursor: pointer; }
`;

// workaround: only one call to globalStyle
globalStyle(globalStyleString);

export default function App() {

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const [state, setState] = createStore({
    fileList: [],
    fileSelected: '',
  });

  onMount(() => {
    loadFiles();
  });

  //const rootPath = "";
  const rootPath = "/"; // needed for fs.readdir

  async function loadFiles(node = null, prefix = '', get = null) {
    console.log("loadFiles node", unwrap(node));
    const path = (node && get) ? get.path(node, prefix) : rootPath;

    const keyPath = ['fileList'];
    const childNodesIdx = 3;
    let parentDir = state.fileList;
    console.log(`loadFiles build keyPath. prefix "${prefix}" + path "${path}"`);
    path.split('/').filter(Boolean).forEach((d, di) => {
      const i = parentDir.findIndex(([ depth, type, file, arg ]) => (type == 'd' && file == d));
      console.log(`loadFiles build keyPath. depth ${di}`, { parentDir, i, d });
      keyPath.push(i); parentDir = parentDir[i];
      keyPath.push(childNodesIdx); parentDir = parentDir[childNodesIdx];
    });

    //console.dir({ prefix, keyPath, val: state(...keyPath) })
    //console.dir({ prefix, keyPath, parentDir })

    if (parentDir.length > 0) {
      console.log(`already loaded path "${path}"`);
      return; // already loaded
    };

    /*
    // load files from API server
    const dataObject = { path };
    const postOptions = data => ({
      method: 'POST', body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await fetch(`/api/list`, postOptions(dataObject));
    if (!response.ok) { console.log(`http request error ${response.status}`); return; }
    const responseData = await response.json();
    //console.dir(responseData.files);
    */
    // mock the server response
    await sleep(500); // loading ...
    const depth = path.split('/').filter(Boolean).length;
    console.log(`loadFiles path = "${path}" + depth "${depth}" + prefix "${prefix}"`);
    const responseData = {
      files: Array.from({ length: 5 }).map((_, idx) => {
        const typeList = 'dddfl'; // dir, file, link
        const type = typeList[Math.round(Math.random() * (typeList.length - 1))];
        if (type == 'd') return [ depth, type, `dirr-${depth}-${idx}`, [] ];
        if (type == 'f') return [ depth, type, `file-${depth}-${idx}` ];
        if (type == 'l') return [ depth, type, `link-${depth}-${idx}`, `link-target-${depth}-${idx}` ];
      }),
    }
    /*
    // load files from fs
    // TODO update on changes in fs. inotify?
    const depth = path.split('/').filter(Boolean).length;
    console.log(`loadFiles path = "${path}" + depth "${depth}" + prefix "${prefix}"`);
    const dirFiles = await fs.promises.readdir(path || "/");
    console.log("dirFiles", dirFiles);
    const responseData = {
      files: await Promise.all(dirFiles.map(async (fileName) => {
        const filePath = path + "/" + fileName;
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
          return [ depth, "d", fileName, [] ];
        }
        else if (stats.isSymbolicLink()) {
          const linkTarget = await fs.promises.readlink(filePath);
          return [ depth, "l", fileName, linkTarget ];
        }
        else {
          return [ depth, "f", fileName ];
        }
      })),
    };
    */

    // add new files to the app state
    if (!state.fileList || state.fileList.length == 0)
      setState('fileList', responseData.files); // init
    else {
      //console.log(`add files for path ${path}`)
      setState(...keyPath, responseData.files);
    }
  }

  function fileListGetters() {
    const get = {};
    get.isLeaf = node => (node[1] != 'd');
    //get.name = node => node[2];
    // append slash to directory names
    get.name = node => node[2] + ((node[1] == 'd') ? "/" : "");
    get.path = (node, prefix) => (prefix || rootPath) + get.name(node);
    get.childNodes = node => node[3];
    const fancyPath = (node, prefix) => (
      prefix ? <>
        <span class="prefix">{(() => prefix)()}</span>
        <span class="name">{get.name(node)}</span>
      </> : (rootPath + get.name(node))
    );
    get.branchLabel = fancyPath;
    get.emptyLabel = (prefix) => '( empty )';
    const isLink = node => (node[1] == 'l');
    const linkTarget = node => node[3];
    const getSelectFile = (node, prefix) => () => setState('fileSelected', get.path(node, prefix));
    get.leafLabel = (node, prefix) => {
      if (isLink(node))
        return <>
          <span class="link-source" onClick={getSelectFile(node, prefix)}>{fancyPath(node, prefix)}</span>{" -> "}
          <span class="link-target">{linkTarget(node)}</span>
        </>;
      return <span class="file" onClick={getSelectFile(node, prefix)}>{fancyPath(node, prefix)}</span>;
    };
    return get;
  }

  function fileTreeGetters() {
    const get = {};
    get.isLeaf = node => (node[1] != 'd');
    //get.name = node => node[2];
    // append slash to directory names
    get.name = node => node[2] + ((node[1] == 'd') ? "/" : "");
    get.path = (node, prefix) => (prefix || rootPath) + get.name(node);
    get.childNodes = node => node[3];
    get.emptyLabel = (_prefix) => '( empty )';
    const isLink = node => (node[1] == 'l');
    const linkTarget = node => node[3];
    const simplePath = (node, _prefix) => (
      <span class="name">{get.name(node)}</span>
    );
    get.branchLabel = simplePath;
    const getSelectFile = (node, prefix) => () => setState('fileSelected', get.path(node, prefix));
    get.leafLabel = (node, prefix) => {
      if (isLink(node))
        return <>
          <span class="link-source" onClick={getSelectFile(node, prefix)}>{simplePath(node, prefix)}</span>{" -> "}
          <span class="link-target">{linkTarget(node)}</span>
        </>;
      return <span class="file" onClick={getSelectFile(node, prefix)}>{simplePath(node, prefix)}</span>;
    };
    return get;
  }

  function fileListFilter() {
    return node => (node[2][0] != '.'); // hide dotfiles
  }

  return (
    <div>
      <h2>demo for {pkg.name}</h2>
      <div style="margin-bottom: 1em">source code: <a href={pkg.homepage}>{pkg.homepage}</a></div>
      <div>click on a directory to load more files</div>
      <div>click on a file to select it. selected file: {state.fileSelected ? <code>{state.fileSelected}</code> : '( none )'}</div>
      <h4>file tree, show only file names</h4>
      <div style="height: 8em">{/* TODO use full height of browser window */}
        <TreeView
          data={state.fileList}
          get={fileTreeGetters()}
          filter={fileListFilter()}
          load={loadFiles}
          className="file-tree"
        />
      </div>
      <h4>directory listing, show full file path, similar to the linux command <code>find -printf '%P\\n'</code></h4>
      <div style="height: 8em">{/* TODO use full height of browser window */}
        <TreeView
          data={state.fileList}
          get={fileListGetters()}
          filter={fileListFilter()}
          load={loadFiles}
          className="linux-find"
        />
      </div>
    </div>
  );
}
