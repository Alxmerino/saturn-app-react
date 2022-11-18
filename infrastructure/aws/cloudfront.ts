import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export default class Cloudfront extends pulumi.ComponentResource {
  public readonly originAccessIdentityIamArn: pulumi.Output<string>;
  public readonly CDNEndpoint: pulumi.Output<string>;

  constructor(
    name: string,
    args?: any,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super('custom:resource:CloudFront', name, args, opts);

    const {
      appName,
      includeWWW,
      targetDomain,
      certificateArn,
      logsDomainName,
      contentBucketArn,
      websiteEndpoint,
    } = args;

    // Generate Origin Access Identity to access the private s3 bucket.
    const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
      appName + 'originAccessIdentity',
      {
        comment: 'this is needed to setup s3 polices and make s3 not public.',
      }
    );

    // if config.includeWWW include an alias for the www subdomain
    const distributionAliases = includeWWW
      ? [targetDomain, `www.${targetDomain}`]
      : [targetDomain];

    const tenMinutes = 60 * 10;

    const distributionArgs: aws.cloudfront.DistributionArgs = {
      enabled: true,
      // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
      // Required if you want to access the distribution via config.targetDomain as well.
      aliases: distributionAliases,

      // We only specify one origin for this distribution, the S3 content bucket.
      origins: [
        {
          originId: contentBucketArn,
          domainName: websiteEndpoint,
          originPath: originAccessIdentity.cloudfrontAccessIdentityPath,
          customOriginConfig: {
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: 'http-only',
            originSslProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2'],
          },
        },
      ],

      defaultRootObject: 'index.html',

      // A CloudFront distribution can configure different cache behaviors based on the request path.
      // Here we just specify a single, default cache behavior which is just read-only requests to S3.
      defaultCacheBehavior: {
        targetOriginId: contentBucketArn,

        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],

        forwardedValues: {
          cookies: { forward: 'none' },
          queryString: false,
        },

        minTtl: 0,
        defaultTtl: tenMinutes,
        maxTtl: tenMinutes,
      },

      // "All" is the most broad distribution, and also the most expensive.
      // "100" is the least broad, and also the least expensive.
      priceClass: 'PriceClass_100',

      customErrorResponses: [
        { errorCode: 404, responseCode: 200, responsePagePath: '/index.html' },
      ],

      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },

      viewerCertificate: {
        acmCertificateArn: certificateArn,
        sslSupportMethod: 'sni-only',
      },

      loggingConfig: {
        bucket: logsDomainName,
        includeCookies: false,
        prefix: `${targetDomain}/`,
      },
    };

    const cdn = new aws.cloudfront.Distribution(
      appName + 'cdn',
      distributionArgs
    );

    this.originAccessIdentityIamArn = originAccessIdentity.iamArn;
    this.CDNEndpoint = cdn.domainName;
  }
}
