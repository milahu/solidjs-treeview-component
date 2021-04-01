import { For, Show } from "solid-js";

// TODO add suspense: 'empty' vs 'loading ...' in <li class="empty">

export default function TreeView(props) {
  const classNameExpanded = 'expanded';
  return (
    <ul class={(() => (props.prefix ? 'tree-view' : 'tree-view root'))()}>
      <For each={props.filter ? props.data.filter(props.filter) : props.data} fallback={
        <li class="empty">{props.get.emptyLabel(props.prefix)}</li>
      }>
        {(node, idx) => (
          <Show when={props.get.isLeaf(node)} fallback={
            <li class="branch">
              <span onClick={event => {
                // go up to nearest <li class="branch">
                let li = event.target;
                while (li && li.localName != 'li') li = li.parentNode;
                if (!li) throw { error: 'li not found', event };
                li.classList.toggle(classNameExpanded);
                if (li.classList.contains(classNameExpanded)) {
                  props.load(node, props.prefix, props.get);
                }
              }}>
                {props.get.branchLabel(node, props.prefix)}
              </span>
              <TreeView
                data={props.get.childNodes(node)}
                get={props.get}
                prefix={props.get.path(node, props.prefix)}
                load={props.load}
              />
            </li>
          }>
            <li class="leaf">{props.get.leafLabel(node, props.prefix)}</li>
          </Show>
        )}
      </For>
    </ul>
  );
}
