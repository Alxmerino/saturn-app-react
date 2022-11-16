import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export default class S3 extends pulumi.ComponentResource {
  public readonly arn: pulumi.Output<string>;
  public readonly name: pulumi.Output<string>;
  public readonly websiteUrl: pulumi.Output<string>;

  constructor(
    name: string,
    args?: any,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super('custom:resource:S3', name, args, opts);

    const S3Bucket = new aws.s3.Bucket(name, {
      website: {
        indexDocument: 'index.html',
      },
      acl: 'public-read',
      tags: {
        Project: args?.projectName,
        Name: args?.projectName,
      },
    });

    // Set the access policy for the bucket so all objects are readable
    const bucketPolicy = new aws.s3.BucketPolicy(name + 'BucketPolicy', {
      bucket: S3Bucket.id,
      policy: S3Bucket.arn.apply((bucketArn) =>
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`${bucketArn}/*`],
            },
          ],
        })
      ),
    });

    this.arn = S3Bucket.arn;
    this.name = S3Bucket.bucket;
    this.websiteUrl = S3Bucket.websiteEndpoint;
  }
}
