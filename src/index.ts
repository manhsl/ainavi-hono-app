import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { todos } from './db/schema'

type Bindings = {
  ainavi_hono_db: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 1. Trang chủ: Hiển thị giao diện HTML đơn giản kèm danh sách nhiệm vụ
app.get('/', async (c) => {
  const db = drizzle(c.env.ainavi_hono_db)
  const allTodos = await db.select().from(todos).all()

  // Tạo giao diện HTML thô bằng chuỗi viết trực tiếp
  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Hono + D1 Demo</title>
      <style>
        body { font-family: sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        ul { list-style: none; padding: 0; }
        li { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
        form { display: flex; gap: 10px; margin-bottom: 20px; }
        input[type="text"] { flex: 1; padding: 8px; }
        button { padding: 8px 15px; background: #0070f3; color: white; border: none; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2>Danh sách việc cần làm (D1 Database)</h2>
      <form method="POST" action="/add">
        <input type="text" name="content" placeholder="Nhập việc cần làm..." required />
        <button type="submit">Thêm</button>
      </form>
      <ul>
        ${allTodos.map(todo => `<li><span>${todo.content}</span></li>`).join('')}
      </ul>
    </body>
    </html>
  `
  return c.html(html)
})

// 2. Action xử lý Form thêm mới ToDo (Redirect về trang chủ sau khi thêm)
app.post('/add', async (c) => {
  const db = drizzle(c.env.ainavi_hono_db)
  const body = await c.req.parseBody()
  const content = body['content'] as string

  if (content) {
    await db.insert(todos).values({ content }).run()
  }
  
  return c.redirect('/')
})

export default app