import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

import S3 from './aws/s3';
import IAM from './aws/iam';
import GitHub from './github';
import CloudFront from './aws/cloudfront';

/** Config **/
const appName = 'SaturnFE';
const stackConfig = new pulumi.Config();
const config = {
  appName,
  // pathToWebsiteContents is a relativepath to the website's contents.
  pathToWebsiteContents: stackConfig.require('pathToWebsiteContents'),
  targetDomain: stackConfig.require('targetDomain'),
  certificateArn: stackConfig.get('certificateArn'),
  repository: stackConfig.get('repository'),
  includeWWW: stackConfig.getBoolean('includeWWW') ?? false,
  tags: {
    Project: appName,
    Name: appName,
    Environment: 'Dev',
  },
};

/** S3 Resources **/
const S3Bucket = new S3(appName + '-S3', config);
export const S3BucketArn = S3Bucket.arn;
export const S3BucketName = S3Bucket.name;
export const S3WebsiteUrl = S3Bucket.websiteUrl;
export const S3DomainName = S3Bucket.domainName;
export const S3LogsDomainName = S3Bucket.logsDomainName;

/** IAM Resources **/
const IAMRoles = new IAM(appName + 'IAMRoles', {
  ...config,
  S3BucketArn,
});
export const GHActionRoleArn = IAMRoles.GHActionRoleArn;

/** GitHub Resources **/
const GitHubResource = new GitHub(appName + 'GitHub', {
  ...config,
  GHActionRoleArn,
  S3BucketName,
});

/** CloudFront Resource **/
const CloudFrontResource = new CloudFront(appName + 'CloudFront', {
  ...config,
  contentBucketArn: S3BucketArn,
  websiteEndpoint: S3DomainName,
  logsDomainName: S3LogsDomainName,
});
export const CDNEndpoint = CloudFrontResource.CDNEndpoint;

/** Create Bucket policy **/
S3Bucket.createBucketPolicy({
  ...config,
  originAccessIdentityIamArn: CloudFrontResource.originAccessIdentityIamArn,
});
