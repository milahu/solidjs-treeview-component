import { createState, onMount } from "solid-js";
import { glob as globalStyle } from "solid-styled-components";

import TreeView from "../../"; // -> package.json -> module -> src/TreeView.jsx

// TODO better way to define style?
// we need `node.classList.toggle('expand')`
// but we dont care about the exact class name
globalStyle(`
  ul.tree-view.root { margin-left: 1px; margin-right: 1px; }
  ul.tree-view.root { height: 100%; /* fit to container */; overflow: auto; /* scroll on demand */ }
  ul.tree-view { text-align: left; }
  ul.tree-view, ul.tree-view ul { list-style: none; padding: 0; }
  ul.tree-view li { white-space: pre; /* dont wrap on x overflow. TODO fix width on overflow */ }
  ul.tree-view li.branch > span { color: blue; font-family: monospace; }
  ul.tree-view li.branch > ul { display: none; /* default collapsed */ }
  ul.tree-view li.branch.expanded { outline: solid 1px grey; }
  ul.tree-view li.branch.expanded > ul { display: block; }
  ul.tree-view li.empty { font-style: italic; }
  ul.tree-view span.link-source { color: green; font-family: monospace; }
  ul.tree-view span.file { font-family: monospace; }
  /* ul.tree-view span.prefix { opacity: 0.6; } */ /* this looks worse than expected */
`);

export default function App() {

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const [state, setState] = createState({
    fileList: [],
    fileSelected: '',
  });

  onMount(() => {
    loadFiles();
  });

  async function loadFiles(node = null, prefix = '', get = null) {
    const path = (node && get) ? get.path(node, prefix) : '';

    const keyPath = ['fileList'];
    const childNodesIdx = 3;
    let parentDir = state.fileList;
    console.log(`loadFiles build keyPath. prefix ${prefix}. path /${path}`);
    path.split('/').filter(Boolean).forEach((d, di) => {
      const i = parentDir.findIndex(([ depth, type, file, arg ]) => (type == 'd' && file == d));
      console.log(`loadFiles build keyPath. depth ${di}`, { parentDir, i, d });
      keyPath.push(i); parentDir = parentDir[i];
      keyPath.push(childNodesIdx); parentDir = parentDir[childNodesIdx];
    });

    //console.dir({ prefix, keyPath, val: state(...keyPath) })
    //console.dir({ prefix, keyPath, parentDir })

    if (parentDir.length > 0) {
      console.log(`already loaded path /${path}`);
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
    console.log(`loadFiles path = /${path} + depth = ${depth} + prefix = ${prefix}`);
    const responseData = {
      files: Array.from({ length: 5 }).map((_, idx) => {
        const typeList = 'ddfl'; // dir, file, link
        const type = typeList[Math.round(Math.random() * 3)];
        if (type == 'd') return [ depth, type, `dirr-${depth}-${idx}`, [] ];
        if (type == 'f') return [ depth, type, `file-${depth}-${idx}` ];
        if (type == 'l') return [ depth, type, `link-${depth}-${idx}`, `link-target-${depth}-${idx}` ];
      }),
    }

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
    get.name = node => node[2];
    get.path = (node, prefix) => prefix ? `${prefix}/${get.name(node)}` : get.name(node);
    get.childNodes = node => {
      //console.log('get.childNodes. node:', node)
      return node[3];
    };
    const fancyPath = (node, prefix) => (
      prefix ? <>
        <span class="prefix">{(() => prefix)()}/</span>
        <span class="name">{get.name(node)}</span>
      </> : get.name(node)
    );
    get.branchLabel = fancyPath;
    get.emptyLabel = (prefix) => '( empty )';
    const isLink = node => (node[1] == 'l');
    const linkTarget = node => node[3];
    get.leafLabel = (node, prefix) => {
      if (isLink(node))
        return <>
          <span class="link-source">{fancyPath(node, prefix)}</span>{" -> "}
          <span class="link-target">{linkTarget(node)}</span>
        </>;
      return <span class="file" onClick={() => setState('fileSelected', get.path(node, prefix))}>{fancyPath(node, prefix)}</span>;
    };
    return get;
  }

  function fileListFilter() {
    return node => (node[2][0] != '.'); // hide dotfiles
  }

  return (
    <div>
      <div>click on a directory to load more files</div>
      <div>selected file: {state.fileSelected ? <code>{state.fileSelected}</code> : '( none. click a file to select )'}</div>
      <div style="height: 12em">
        <TreeView data={state.fileList} get={fileListGetters()} filter={fileListFilter()} load={loadFiles} />
      </div>
    </div>
  );
}
