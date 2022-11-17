import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';

export default class GitHub extends pulumi.ComponentResource {
  constructor(name: string, args: any, opts?: pulumi.ComponentResourceOptions) {
    super('custom:resource:GitHub', name, args, opts);

    const { appName, GHActionRoleArn, S3BucketName, repository } = args;

    const IAMSecret = new github.ActionsSecret(appName + 'SecretIAM', {
      // @todo: Move to ENV file
      repository,
      secretName: 'IAMROLE_GITHUB',
      plaintextValue: GHActionRoleArn,
    });

    const S3Secret = new github.ActionsSecret(appName + 'SecretS3', {
      // @todo: Move to ENV file
      repository: 'saturn-app-react',
      secretName: 'ACTION_AWS_S3_BUCKET',
      plaintextValue: S3BucketName,
    });
  }
}
