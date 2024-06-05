import { IncomingWebhook } from '@slack/webhook'

export async function handler(event, context){
    const slackWebHookUrl = process.env.SLACK_WEBHOOK_URL
    const slackWebHook = new IncomingWebhook(slackWebHookUrl)
    
    await slackWebHook.send('こんにちわ！AWSのlamdaのシステムを使用して送信されたメッセージです。tokuが作りました！成長だね！')
}