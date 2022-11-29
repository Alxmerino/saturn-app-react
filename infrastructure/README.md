# Static Website Using Amazon S3, CloudFront, and Certificate Manager

This setup uses the following AWS products:

Amazon S3 is used to store the website’s contents.
Amazon CloudFront is the CDN serving content.
Amazon Certificate Manager is used for securing things via HTTPS.

## Config
Configure the Pulumi program using pulumi config set KEY VALUE. There are several configuration settings that need to be set:

- `certificateArn` - ACM certificate to serve content from. ACM certificate creation needs to be done manually. Also, any certificate used to secure a CloudFront distribution must be created in the `us-east-1` region.
- `targetDomain` - The domain to serve the website at (e.g. www.example.com). DNS records are managed manually for now
- `includeWWW` - If true this will create an additional alias record for the www subdomain to your cloudfront distribution.

Alternatively, create a `Pulumi.ENV.yaml` file where `ENV` matches the stack. e.g. Pulumi.dev.yaml. Use the example below and replace with necessary values. 

```
config:
  github:token:
    secure: GITHUB_PERSONAL_ACCESS_TOKEN
  saturn-frontend:certificateArn: CERTIFICATE_ARN
  saturn-frontend:includeWWW: "false"
  saturn-frontend:repository: REPO_NAME
  saturn-frontend:targetDomain: example.com
```

Once the Pulumi progran runs, create a new DNS record to point to the new CloudFront Distribution URL

## Infrastructure diagram

![Saturn FE App Infrastructure - User Flow](https://user-images.githubusercontent.com/1016021/204614167-d2894a45-7862-4f94-be80-4149937b184b.png)
