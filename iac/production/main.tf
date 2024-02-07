data "aws_caller_identity" "current" {}

locals {
    account_id = data.aws_caller_identity.current.account_id
}

output "account_id" {
  value = local.account_id
}


resource "aws_api_gateway_rest_api" "example" {
  name        = "smart-hause-readings-api"
  description = "API for smart hause readings"
}

resource "aws_api_gateway_resource" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id
  parent_id   = aws_api_gateway_rest_api.example.root_resource_id
  path_part   = "readings"
}

resource "aws_api_gateway_method" "example" {
  rest_api_id   = aws_api_gateway_rest_api.example.id
  resource_id   = aws_api_gateway_resource.example.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id
  resource_id = aws_api_gateway_resource.example.id
  http_method = aws_api_gateway_method.example.http_method

  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${aws_lambda_function.smart-hause-readings.arn}/invocations"
}

resource "aws_api_gateway_deployment" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id
  stage_name  = "prod"

  depends_on = [
    aws_api_gateway_integration.example,
  ]
}

resource "aws_iam_role" "lambda_exec" {
  name = "smart-hause-readings-lambda-exec"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_access_sqs" {
  name = "smart-hause-readings-sqs-access"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sqs:SendMessage",
        "sqs:GetQueueUrl",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "${aws_sqs_queue.readings.arn}",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_lambda_function" "smart-hause-readings" {
  filename = "deploy.zip"
  function_name = "smart-hause-readings"
  description   = "Processes smart hause readings"
  handler       = "index.handler"
  runtime       = "nodejs16.x"
  role          = "${aws_iam_role.lambda_exec.arn}"
  timeout       = "30"
  environment {
    variables = {
      QUEUE_URL = "${aws_sqs_queue.readings.id}"
    }
  }
}

resource "aws_sqs_queue" "readings" {
  name = "smart-hause-readings-queue"
}

resource "aws_lambda_permission" "allow_api_gateway" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.smart-hause-readings.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.example.execution_arn}/*"
}

// second part of the flow

resource "aws_lambda_function" "smart-hause-readings-persistence" {
  filename = "deploy.zip"
  function_name = "smart-hause-readings-persistence"
  runtime = "nodejs16.x"
  role = aws_iam_role.iam_for_lambda.arn
  handler = "index.handler"
  timeout       = "30"
  environment {
    variables = {
      QUEUE_URL = "${aws_sqs_queue.readings.id}"
    }
  }
}

resource "aws_lambda_event_source_mapping" "smart-hause-readings-queue" {
  event_source_arn = aws_sqs_queue.readings.arn
  function_name = aws_lambda_function.smart-hause-readings-persistence.function_name
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "iam_for_lambda_policy" {
  name = "iam_for_lambda_policy"
  role = aws_iam_role.iam_for_lambda.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:${local.account_id}:table/smart-hause-readings",
        "arn:aws:sqs:us-east-1:${local.account_id}:smart-hause-readings-queue"
      ]
    }
  ]
}
EOF
}

resource "aws_dynamodb_table" "smart-hause-readings" {
  name           = "smart-hause-readings"
  hash_key       = "id"
  read_capacity  = 5
  write_capacity = 5

  attribute {
    name = "id"
    type = "S"
  }
}
