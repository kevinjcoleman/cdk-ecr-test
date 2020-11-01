#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStackStack } from '../lib/ecr-stack-stack';

const app = new cdk.App();
new EcrStackStack(app, 'EcrStackStack');
