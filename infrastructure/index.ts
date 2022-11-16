import S3 from './aws/s3';
import IAM from './aws/iam';
import GitHub from './github';

const appName = 'Saturn-FE';
const tags = {
  Project: appName,
};

/** S3 Resources **/
const S3Bucket = new S3(appName + 'S3', {
  projectName: appName,
  tags,
});

/** IAM Resources **/
const IAMRoles = new IAM(appName + 'IAM-roles', {
  projectName: appName,
  S3BucketArn: S3Bucket.arn,
  tags,
});

/** GitHub Resources **/
const GitHubResource = new GitHub(appName + 'GitHub', {
  projectName: appName,
  GHActionRoleArn: IAMRoles.GHActionRoleArn,
  S3BucketName: S3Bucket.name,
});

/** Exports **/
export const S3BucketArn = S3Bucket.arn;
export const S3BucketName = S3Bucket.name;
export const GHActionRoleArn = IAMRoles.GHActionRoleArn;
