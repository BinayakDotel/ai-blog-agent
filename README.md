AI Note Creator

Welcome to the AI Note Creator, a powerful tool designed to generate educational notes tailored to your needs! This application leverages advanced AI to create structured, student-friendly notes based on specified topics and levels.

Overview

The AI Note Creator is a Flask-based web application that uses a crew of AI agents to plan, write, and edit educational content. It has been successfully deployed and is now accessible online.

Deployment Details





Platform: Deployed on Railway.



Deployment Date: Successfully deployed on August 04, 2025.



Status: Live and operational.

Accessing the Web App

Visit the live application at: https://ai-agent-server-production-565e.up.railway.app/

How to Use





Navigate to the provided URL.



Use the /generate-blog endpoint with a POST request to create notes. Send a JSON body with a topic field (e.g., {"topic": "Artificial Intelligence"}).



Check the /health endpoint to verify the app's status with a GET request.

Features





Generates structured notes with introductions, key points, examples, and conclusions.



Tailors content to student levels (e.g., high school, college).



Includes references for further reading.

Getting Started Locally

To run this project locally:





Clone the repository.



Install dependencies using pip install -r requirements.txt.



Set the HF_TOKEN environment variable.



Run python app.py and access it at http://localhost:5000.

Support

For any issues or questions, please refer to the deployment logs on Railway or contact the project maintainer.
