import * as pulumi from '@pulumi/pulumi';

import S3 from './aws/s3';
import IAM from './aws/iam';
import GitHub from './github';

/** Config **/
const appName = 'SaturnFE';
const stackConfig = new pulumi.Config('dev');
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
  },
};

/** S3 Resources **/
const S3Bucket = new S3(appName + '-S3', config);

/** IAM Resources **/
const IAMRoles = new IAM(appName + 'IAMRoles', {
  ...config,
  S3BucketArn: S3Bucket.arn,
});

/** GitHub Resources **/
const GitHubResource = new GitHub(appName + 'GitHub', {
  ...config,
  GHActionRoleArn: IAMRoles.GHActionRoleArn,
  S3BucketName: S3Bucket.name,
});

/** Exports **/
export const S3BucketArn = S3Bucket.arn;
export const S3BucketName = S3Bucket.name;
export const S3WebsiteUrl = S3Bucket.websiteUrl;
export const GHActionRoleArn = IAMRoles.GHActionRoleArn;
