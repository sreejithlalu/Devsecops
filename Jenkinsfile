pipeline {
  agent any
tools {
    nodejs "Node18"
}
  environment
  {
    DOCKER_REG = "sreejitheyne/devsecops"
  }
  stages {
    stage('Git Code fetch') {
      steps {
        git branch: 'main', url: 'https://github.com/sreejithlalu/Devsecops.git'
      }
    }
    stage('Docker Tag') {
      steps {
                    env.GIT_SHORT = "${env.GIT_COMMIT?.take(7) ?: 'local'}"
                    env.TAG = "${env.GIT_SHORT}-${env.BUILD_ID}"
                    env.FRONTEND_IMAGE = "${DOCKER_REG}:frontend-${env.TAG}"
                    env.BACKEND_IMAGE = "${DOCKER_REG}:backend-${env.TAG}"
            }
        }
     stage('npm dependency check') {
      steps {
        dir('Application-Code/backend') {
        sh 'npm ci'
      }
        dir('Application-Code/frontend') {
        sh 'npm ci'
      }
     }
    }
     stage('Build Images') {
      steps {
        dir('Application-Code/backend') { sh 'docker build -t ${env.BACKEND_IMAGE} .' }
        dir('Application-Code/frontend') {sh 'docker build -t ${env.FRONTEND_IMAGE} .'}
      }
    }
     stage('Docker Image Push') {
      steps {
        docker.withRegistry('https://registry.hub.docker.com', 'docker_cred'){
        sh 'docker push ${env.BACKEND_IMAGE} '
        sh 'docker push ${env.FRONTEND_IMAGE}'
      }
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
