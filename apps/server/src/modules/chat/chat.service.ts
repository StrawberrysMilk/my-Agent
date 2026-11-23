import {modelName, openai} from '../../llm/index.js'

export async function generateChatReply(message: string): Promise<string> {
    const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [{role: 'user', content: message}],
    })

    const answer = completion.choices[0]?.message?.content

    if (!answer)
        throw new Error('模型没有返回有效内容')

    return answer
}

export async function* streamChatReply(
    message: string,
    signal?: AbortSignal,
): AsyncGenerator<string> {
    const stream = await openai.chat.completions.create({
        model: modelName,
        messages: [{role: 'user', content: message}],
        stream: true,
    }, {signal})

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (typeof content === 'string' && content.length > 0) {
            yield content
        }
    }
}
