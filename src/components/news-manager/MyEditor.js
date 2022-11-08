import React, { useState, useEffect } from 'react'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react'


export default function MyEditor(props) {
  const [editor, setEditor] = useState(null)
  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>')

  // 工具栏配置
  const toolbarConfig = {}
  // 编辑器配置

  const editorConfig = {
    placeholder: '请输入内容...',
  }

  useEffect(() => {
    setHtml(props.content)
  }, [props.content])

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  // 向父组件传递富文本的内容
  props.getContent(html)
  return (
    <div>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '300px', overflowY: 'hidden' }}
        />
      </div>
    </div>
  )
}
