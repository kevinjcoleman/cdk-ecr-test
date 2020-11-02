import * as cdk from '@aws-cdk/core'
import * as ecr from '@aws-cdk/aws-ecr'
import { User, CfnAccessKey } from '@aws-cdk/aws-iam'

export class EcrStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const repository = new ecr.Repository(this, 'dev-server-registry')

        // only keep images for a month
        repository.addLifecycleRule({
            maxImageAge: cdk.Duration.days(30),
        })

        // create ecr user
        const ecrUser = new User(this, 'ecr-user', {
            password: cdk.SecretValue.plainText('cerebralECR!'),
        })
        repository.grantPullPush(ecrUser)

        const accessKey = new CfnAccessKey(this, 'ecr-user-access-key', {
            userName: ecrUser.userName,
        })

        new cdk.CfnOutput(this, 'ecr-user-access-id', { value: accessKey.ref })
        new cdk.CfnOutput(this, 'ecr-user-access-secret-access-key', {
            value: accessKey.attrSecretAccessKey,
        })
        new cdk.CfnOutput(this, 'repositoryName', {
            value: repository.repositoryName,
        })
    }
}
