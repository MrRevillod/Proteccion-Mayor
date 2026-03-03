lens:
	act --secret-file .env -W .github/workflows/code-lens.yml -P ubuntu-latest=catthehacker/ubuntu:runner-22.04 --eventpath push-event.json
