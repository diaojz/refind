const DEEPSEEK_BASE = 'https://api.deepseek.com/v1'

function getApiKey() {
  // 优先从 localStorage 读取用户输入的 key
  const userKey = localStorage.getItem('deepseek_api_key')
  if (userKey) return userKey

  // 开发环境回退到 .env
  const envKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (envKey && envKey !== 'sk-your-key-here') return envKey

  throw new Error('请先配置 DeepSeek API Key')
}

export function setApiKey(key) {
  localStorage.setItem('deepseek_api_key', key)
}

export function hasApiKey() {
  return !!localStorage.getItem('deepseek_api_key') ||
         (import.meta.env.VITE_DEEPSEEK_API_KEY &&
          import.meta.env.VITE_DEEPSEEK_API_KEY !== 'sk-your-key-here')
}

export async function callDeepSeek(systemPrompt, userContent) {
  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`DeepSeek API 错误 (${response.status}): ${err}`)
  }

  const data = await response.json()
  const text = data.choices[0].message.content

  // 尝试解析 JSON（模型可能返回 ```json 包裹）
  const cleaned = text.replace(/^```json\s*|\s*```$/g, '').trim()
  return JSON.parse(cleaned)
}
