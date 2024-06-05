import { IncomingWebhook } from '@slack/webhook'
import moment from 'moment'
import AWS from 'aws-sdk'

export async function handler(event, context){
    // const slackWebHookUrl = process.env.SLACK_WEBHOOK_URL
    // const slackWebHook = new IncomingWebhook(slackWebHookUrl)
    // await slackWebHook.send('こんにちわ！AWSのlamdaのシステムを使用して送信されたメッセージです。tokuが作りました！成長だね！')
    const now = moment()
    const start = now.format('YYYY-MM-01')
    const end = now.add(1, 'months').format('YYYY-MM-01')
    // aws --region us-east-1 ce get-cost-and-usage --time-period Start=2023-11-01,End=2024-01-01 --granularity MONTHLY --metrics UnblendedCost
    // これがコンソールで実行したもので、コードで再現する
    const ce = new AWS.CostExplorer({region:'us-east-1'})
    const params = {
        TimePeriod: {
            Start: start,
            End: end
        },
        Granularity: 'MONTHLY',
        Metrics: ['UnblendedCost']
    }
    const costAndUsage = await ce.getCostAndUsage(params).promise()
    // console.log(JSON.stringify(costAndUsage))
    const usdCost = costAndUsage.ResultsByTime[0].Total.UnblendedCost.Amount
    console.log(usdCost)
    
    const slackWebHookUrl = process.env.SLACK_WEBHOOK_URL
    const slackWebHook = new IncomingWebhook(slackWebHookUrl)
    await slackWebHook.send( start + 'から' + end + 'までの請求金額は' + usdCost + 'です。')
}