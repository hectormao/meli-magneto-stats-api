resource "aws_iam_role" "magneto_stats" {
  name = "${local.function_name}_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "magneto_stats" {
  name   = "${local.function_name}_policy"
  role   = aws_iam_role.magneto_stats.id
  policy = <<EOF
{
   "Version": "2012-10-17",
   "Statement": [
       {
           "Effect": "Allow",
           "Action": [
               "logs:CreateLogGroup",
               "logs:CreateLogStream",
               "logs:PutLogEvents"
           ],
           "Resource": "arn:aws:logs:*:*:*"
       },
       {
           "Effect": "Allow",
           "Action": [
               "dynamodb:GetItem"
           ],
           "Resource": "${data.aws_dynamodb_table.stats.arn}"
       }
   ]
}
EOF
}
