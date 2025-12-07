pipeline {
  agent any
  environment
  {
    FRONTEND_IMAGE = "devsecops-frontend:${env.BUILD_ID}"
    BACKEND_IMAGE = "devsecops-backend:${env.BUILD_ID}"
  }
  stages {
    stage('Git Code fetch') {
      steps {
        git branch: 'main', url: 'https://github.com/sreejithlalu/Devsecops.git'
      }
    }
     stage('Frontend & Backend') {
      steps {
        dir('Application-Code/backend') { 
        sh 'npm ci' 
        sh 'npm test'
      }
        dir('Application-Code/frontend') { 
        sh 'npm ci'
        sh 'npm test'
      }
     }
    }
     stage('Build Images') {
      steps {
        dir('Application-Code/backend') { sh 'docker build -t ${BACKEND_IMAGE} .' }
        dir('Application-Code/frontend') {sh 'docker build -t ${FRONTEND_IMAGE} .'}
      }
    }
     stage('Info') {
      steps {
        echo "Build: ${env.BACKEND_IMAGE} 'Successfully Build'"
        echo "Build: ${env.FRONTEND_IMAGE} 'Successfully Build'"
      }
    }
  }
}

