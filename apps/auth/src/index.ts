import { AccountModule } from "./account/module"
import { SessionModule } from "./session/module"
import { MailerService, AuthenticationService } from "@repo/lib"
import { services, createApplication, startService } from "@repo/lib"

const auth = new AuthenticationService()
const mailer = new MailerService()

const modules = [new SessionModule(auth), new AccountModule(mailer)]

const app = createApplication(modules)

app.listen(services.AUTH.port, () => {
	startService("AUTHENTICATION", services.AUTH.url, services.AUTH.port)
})
