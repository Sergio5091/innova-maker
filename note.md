Mettez à jour vos serveurs de noms pour activer Cloudflare.
Il s'agit de la dernière étape pour permettre à Cloudflare d'accélérer et de protéger votre trafic web.

Connectez-vous à votre fournisseur DNS (très probablement votre registraire).
Votre registraire est
Nom bon marché

Si vous avez acheté votre domaine par l'intermédiaire d'un revendeur (par exemple, Squarespace) ou si vous utilisez un fournisseur DNS distinct, connectez-vous plutôt à ce compte.

Remplacez vos serveurs de noms actuels par les serveurs de noms Cloudflare.
Cela ne devrait pas entraîner d'interruption de service, mais vous pouvez ignorer cette étape et vérifier votreenregistrements DNSd'abord.
Trouvez la section des serveurs de noms
Ajoutez chacun de vos serveurs de noms Cloudflare attribués :
`danica.ns.cloudflare.com`
`ken.ns.cloudflare.com`
Supprimez vos autres serveurs de noms :
dns1.registrar-servers.com

dns2.registrar-servers.com

Enregistrez vos modifications