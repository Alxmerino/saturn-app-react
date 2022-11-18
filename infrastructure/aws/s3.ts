import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export default class S3 extends pulumi.ComponentResource {
  public readonly id: pulumi.Output<string>;
  public readonly arn: pulumi.Output<string>;
  public readonly domainName: pulumi.Output<string>;
  public readonly logsArn: pulumi.Output<string>;
  public readonly logsDomainName: pulumi.Output<string>;
  public readonly name: pulumi.Output<string>;
  public readonly websiteUrl: pulumi.Output<string>;

  constructor(
    name: string,
    args?: any,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super('custom:resource:S3', name, args, opts);

    const { targetDomain, tags } = args;

    const S3Bucket = new aws.s3.Bucket(targetDomain, {
      website: {
        indexDocument: 'www/index.html',
        errorDocument: 'www/index.html',
      },
      acl: 'public-read',
      tags,
    });

    // Logs Bucket
    const logsBucket = new aws.s3.Bucket('requestLogs', {
      bucket: `${targetDomain}-logs`,
      acl: 'private',
      tags,
    });

    this.id = S3Bucket.id;
    this.arn = S3Bucket.arn;
    this.domainName = S3Bucket.bucketDomainName;
    this.logsArn = logsBucket.arn;
    this.logsDomainName = logsBucket.bucketDomainName;
    this.name = S3Bucket.bucket;
    this.websiteUrl = S3Bucket.websiteEndpoint;
  }

  createBucketPolicy(args: any) {
    const { originAccessIdentityIamArn } = args;
    // Set the access policy for the bucket so all objects are readable
    const bucketPolicy = new aws.s3.BucketPolicy(this.name + 'BucketPolicy', {
      bucket: this.id,
      policy: pulumi
        .all([originAccessIdentityIamArn, this.arn])
        .apply(([oaiArn, bucketArn]) =>
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: oaiArn,
                }, // Only allow Cloudfront read access.
                Action: ['s3:GetObject'],
                Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
              },
            ],
          })
        ),
    });
  }
}
