const {
  DynamoDBClient,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const AdmZip = require("adm-zip");
require("dotenv").config();
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

// DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadJson = async (req, res) => {
  try {
    // Extract from body
    const { json: reportData } = req.body || {};

    // Extract from headers
    const headers = req.headers;
    const apiKey = headers.authorization
      ? headers.authorization.replace("Bearer ", "")
      : null;
    const projectId = headers["x-project-id"];
    const organizationId = headers["x-organization-id"];
    const reportName = headers["x-report-name"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Missing API key in Authorization header.",
      });
    }
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Missing projectId (body or header).",
      });
    }
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Missing organizationId (body or header).",
      });
    }

    console.log({
      json: reportData,
      reportName,
      projectId,
      organizationId,
    });

    const item = {
      reportName: { S: reportName },
      data: {
        S: JSON.stringify(reportData),
      },
      orgId: { S: organizationId },
      projectId: { S: projectId },
      uploadedAt: { S: new Date().toISOString() },
    };
    await dynamoClient.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: item,
      })
    );
    res.json({
      message: "JSON uploaded to DynamoDB",
      reportName: item.reportName.S,
    });
  } catch (err) {
    console.error("DynamoDB upload error:", err);
    res.status(500).json({ error: "Failed to upload JSON to DynamoDB" });
  }
};

exports.uploadZip = async (req, res) => {
  try {
    const { reportName } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();
    const uploadResults = [];

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      const fileKey = `${reportName}/${entry.entryName}`;
      const fileBuffer = entry.getData();

      // Determine content type based on file extension
      let contentType = "application/octet-stream"; // default
      if (
        entry.entryName.endsWith(".html") ||
        entry.entryName.endsWith(".htm")
      ) {
        contentType = "text/html";
      } else if (entry.entryName.endsWith(".css")) {
        contentType = "text/css";
      } else if (entry.entryName.endsWith(".js")) {
        contentType = "application/javascript";
      } else if (entry.entryName.endsWith(".json")) {
        contentType = "application/json";
      } else if (entry.entryName.endsWith(".png")) {
        contentType = "image/png";
      } else if (
        entry.entryName.endsWith(".jpg") ||
        entry.entryName.endsWith(".jpeg")
      ) {
        contentType = "image/jpeg";
      }

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: contentType,
          ContentLength: fileBuffer.length,
        })
      );

      uploadResults.push({
        file: entry.entryName,
        key: fileKey,
      });
    }

    const fileKey = `${reportName}`;
    res.json({ message: "ZIP uploaded to S3", fileKey });
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ error: "Failed to upload ZIP to S3" });
  }
};

exports.getExecutions = async (req, res) => {
  try {
    const { projectId } = req.query;
    console.log("Fetching executions for project:", projectId);

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const data = await dynamoDocClient.send(
      new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: "projectId-index",
        KeyConditionExpression: "#id = :projectId",
        ExpressionAttributeNames: {
          "#id": "projectId",
        },
        ExpressionAttributeValues: {
          ":projectId": projectId,
        },
      })
    );

    if (!data.Items || data.Items.length === 0) {
      return res
        .status(404)
        .json({ error: "No reports found for this project" });
    }

    const reports = data.Items.map(item => ({
      reportName: item.reportName,
      orgId: item.orgId,
      projectId: item.projectId,
      uploadedAt: item.uploadedAt,
      data: parsedData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data
    }));

    console.log("Reports retrieved:", reports);
    res.json({ reports });
  } catch (err) {
    console.error("DynamoDB get error:", err);
    res.status(500).json({ error: "Failed to retrieve report from DynamoDB" });
  }
};

module.exports = {
  uploadJson: exports.uploadJson,
  uploadZip: exports.uploadZip,
  getExecutions: exports.getExecutions,
};
