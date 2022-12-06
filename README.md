# solidjs-treeview-component

usage: [src/demo/App.jsx](src/demo/App.jsx)

live demo: [https://milahu.github.io/solidjs-treeview-component/](https://milahu.github.io/solidjs-treeview-component/)

## aria spec

https://www.w3.org/TR/wai-aria-practices/#TreeView

> A tree view widget presents a hierarchical list.  
> Any item in the hierarchy may have child items,  
> and items that have children  
> may be expanded or collapsed to show or hide the children.
>
> For example, in a file system navigator  
> that uses a tree view to display folders and files,  
> an item representing a folder  
> can be expanded to reveal the contents of the folder,  
> which may be files, folders, or both.

## other treeview components

- https://github.com/aquaductape/solid-tree-view - a treeview component in solidjs
  - https://www.reddit.com/r/solidjs/comments/jitfj4/recreated_redux_tree_view_example_with_solid/
- https://svelte.dev/tutorial/svelte-self - a treeview component in svelte
- https://github.com/mar10/fancytree - a treeview component in jQuery

## solidjs docs

- https://github.com/solidjs/solid/discussions/499 - efficiently render tree structures, how to update nodes in tree
- https://www.solidjs.com/tutorial/stores_nested_reactivity - One of the reasons for fine-grained reactivity in Solid is that it can handle nested updates independently
