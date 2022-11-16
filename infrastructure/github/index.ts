import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';

export default class GitHub extends pulumi.ComponentResource {
  constructor(name: string, args: any, opts?: pulumi.ComponentResourceOptions) {
    super('custom:resource:IAM', name, args, opts);

    const { projectName, GHActionRoleArn, S3BucketName } = args;

    const IAMSecret = new github.ActionsSecret(projectName + 'SecretIAM', {
      // @todo: Move to ENV file
      repository: 'saturn-app-react',
      secretName: 'IAMROLE_GITHUB',
      plaintextValue: GHActionRoleArn,
    });

    const S3Secret = new github.ActionsSecret(projectName + 'SecretS3', {
      // @todo: Move to ENV file
      repository: 'saturn-app-react',
      secretName: 'ACTION_AWS_S3_BUCKET',
      plaintextValue: S3BucketName,
    });
  }
}
