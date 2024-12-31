import { AccountModule } from "./account/module"
import { SessionModule } from "./session/module"
import { log, services, AuthenticationService, createApplication, MailerService } from "@repo/lib"

const auth = new AuthenticationService()
const mailer = new MailerService()

const modules = [new SessionModule(auth), new AccountModule(mailer)]

const app = createApplication(modules)

app.listen(services.AUTH.port, () => {
	log(`Auth microservice running on ${services.AUTH.url}`)
})
