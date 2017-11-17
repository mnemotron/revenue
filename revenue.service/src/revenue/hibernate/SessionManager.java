package revenue.hibernate;

import org.hibernate.Session;
import org.hibernate.Transaction;

public class SessionManager
{
	public static void initSession()
	{
		Session locSession = HibernateSessionFactory.getSessionFactory().getCurrentSession();

		locSession.beginTransaction();
	}

	public static Transaction getTransaction()
	{
		return getSession().getTransaction();
	}

	public static Session getSession()
	{
		return HibernateSessionFactory.getSessionFactory().getCurrentSession();
	}

	public static void closeSession()
	{
		SessionManager.getSession().close();
	}
}