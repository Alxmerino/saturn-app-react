import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export default class IAM extends pulumi.ComponentResource {
  public readonly GHActionRoleArn: pulumi.Output<string>;

  constructor(name: string, args: any, opts?: pulumi.ComponentResourceOptions) {
    super('custom:resource:IAM', name, args, opts);

    const { projectName, tags, S3BucketArn } = args;

    const GHOpenIdConnectProvider = new aws.iam.OpenIdConnectProvider(
      projectName + 'GHOpenIDConnect',
      {
        clientIdLists: ['sts.amazonaws.com'],
        thumbprintLists: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
        url: 'https://token.actions.githubusercontent.com',
      }
    );

    const GHActionRole = GHOpenIdConnectProvider.arn.apply((arn) => {
      return new aws.iam.Role(projectName + 'GHActionRole', {
        assumeRolePolicy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Federated: arn,
              },
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: {
                StringEquals: {
                  'token.actions.githubusercontent.com:aud':
                    'sts.amazonaws.com',
                },
              },
            },
          ],
        }),
        tags,
      });
    });

    const GHActionRolePolicy = pulumi.all([S3BucketArn]).apply(([arn]) => {
      return new aws.iam.RolePolicy(args?.projectName + 'GHActionRolePolicy', {
        role: GHActionRole.id,
        policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:putObject'],
              Effect: 'Allow',
              Resource: `${arn}/*`,
            },
          ],
        }),
      });
    });

    this.GHActionRoleArn = GHActionRole.arn;
  }
}
