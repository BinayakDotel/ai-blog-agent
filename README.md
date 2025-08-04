# AI Note Creator

Welcome to the AI Note Creator, a powerful tool designed to generate educational notes tailored to your needs! This Flask-based web application leverages advanced AI to create structured, student-friendly notes based on specified topics and levels.

## Overview
The AI Note Creator uses a crew of AI agents to plan, write, and edit educational content. It has been successfully deployed and is now live for public use.

## Deployment Details
- **Platform**: Deployed on a web hosting service.
- **Deployment Date**: Successfully deployed on August 04, 2025.
- **Status**: Live and operational.

## Accessing the Web App
### How to Use
1. Navigate to the provided URL.
2. Use the `/generate-blog` endpoint with a POST request to create notes. Send a JSON body with a `topic` field (e.g., `{"topic": "Artificial Intelligence"}`).
3. Check the `/health` endpoint with a GET request to verify the app's status.

Visit the live application at: [https://www.pixelyardstudios.com/](https://www.pixelyardstudios.com/)

## Features
- Generates structured notes with introductions, key points, examples, and conclusions.
- Tailors content to student levels (e.g., high school, college).
- Includes references for further reading.

## Getting Started Locally
### Steps to Run Locally
1. Clone the repository.
2. Install dependencies using `pip install -r requirements.txt`.
3. Set the `HF_TOKEN` environment variable.
4. Run `python app.py` and access it at `http://localhost:5000`.

## Support
For any issues or questions, please check the deployment logs or contact the project maintainer.
