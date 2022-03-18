import { For, Show } from "solid-js";

// TODO add suspense: 'empty' vs 'loading ...' in <li class="empty">
// TODO use array for prefix (then getting the depth is trivial, and we can remove depth from the data array)

function EmptyNode(props) {
  return (
    <li class="empty">
      {props.get.emptyLabel(props.prefix)}
    </li>
  );
}

function LeafNode(props) {
  return (
    <li class="leaf">
      {props.get.leafLabel(props.node, props.prefix)}
    </li>
  );
}

function BranchNode(props) {
  const classNameExpanded = () => props.classNameExpanded || 'expanded';
  const prefix = () => props.get.path(props.node, props.prefix);
  const childNodes = () => props.get.childNodes(props.node);
  return (
    <li class="branch">
      <div class="branch-label" onClick={event => {
        // go up to nearest <li class="branch">
        let li = event.target;
        while (li && li.localName != 'li') li = li.parentNode;
        if (!li) throw { error: 'li not found', event };
        li.classList.toggle(classNameExpanded());
        if (li.classList.contains(classNameExpanded())) {
          props.load && props.load(props.node, props.prefix, props.get);
        }
      }}>
        {props.get.branchLabel(props.node, props.prefix)}
      </div>
      {props.recurse({
        ...props,
        data: childNodes(),
        prefix: prefix(),
      })}
    </li>
  );
}

const TreeView = function thisComponent(props) {
  const classNameExpanded = 'expanded';
  return (
    <ul class={(() => ('tree-view ' + (props.prefix ? '' : 'root ') + props.className))()}>
      <For each={props.filter ? props.data.filter(props.filter) : props.data} fallback={
        props.component?.empty ? props.component.empty(props) : EmptyNode(props)
      }>
        {(node, nodeIdx) => {
          const nodeProps = () => ({
            ...props,
            node,
            nodeIdx,
            recurse: thisComponent,
          });
          return (
            <Show when={props.get.isLeaf(node)} fallback={
              props.component?.branch ? props.component.branch(nodeProps()) : BranchNode(nodeProps())
            }>
              {props.component?.leaf ? props.component.leaf(nodeProps()) : LeafNode(nodeProps())}
            </Show>
          );
        }}
      </For>
    </ul>
  );
}

export default TreeView;
