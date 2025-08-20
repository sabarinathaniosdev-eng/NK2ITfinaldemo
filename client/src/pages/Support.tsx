import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp, BookOpen, MessageCircle, Ticket } from 'lucide-react';

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does license delivery take?",
      answer: "License keys are delivered instantly upon successful payment confirmation. You'll receive them via email within 5 minutes of purchase completion."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers through our secure BPOINT payment gateway."
    },
    {
      question: "Can I upgrade from Enterprise to Complete edition?",
      answer: "Yes, you can upgrade at any time. Contact our support team to arrange the upgrade and we'll handle the license transfer process."
    },
    {
      question: "Do you provide installation support?",
      answer: "Yes, we offer installation and configuration support as part of our service. Our technicians can assist remotely or provide detailed documentation."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Support & Resources</h1>
        <p className="text-gray-600">
          Get help with your Symantec security solutions. Our Australian-based team is here to assist you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-nk-orange text-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-600 text-sm">
                    222, 20B Lexington Drive<br />
                    Norwest Business Park<br />
                    Baulkham Hills NSW 2153
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-nk-orange text-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-600 text-sm">+61 2 XXXX XXXX</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-nk-orange text-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600 text-sm">support@nk2it.com.au</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-nk-orange text-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Business Hours</div>
                  <div className="text-gray-600 text-sm">Mon-Fri: 9:00 AM - 5:00 PM AEST</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Resources */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6">Support Resources</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="w-5 h-5 text-nk-orange mr-2" />
                  <h4 className="font-medium">Documentation</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Installation guides, user manuals, and best practices.
                </p>
                <Button 
                  variant="link" 
                  className="text-nk-orange hover:text-orange-600 p-0 h-auto text-sm font-medium"
                  data-testid="link-documentation"
                >
                  View Docs →
                </Button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MessageCircle className="w-5 h-5 text-nk-orange mr-2" />
                  <h4 className="font-medium">Live Chat</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Chat with our technical support team in real-time.
                </p>
                <Button 
                  variant="link" 
                  className="text-nk-orange hover:text-orange-600 p-0 h-auto text-sm font-medium"
                  data-testid="button-start-chat"
                >
                  Start Chat →
                </Button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Ticket className="w-5 h-5 text-nk-orange mr-2" />
                  <h4 className="font-medium">Support Ticket</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Submit a detailed support request for complex issues.
                </p>
                <Button 
                  variant="link" 
                  className="text-nk-orange hover:text-orange-600 p-0 h-auto text-sm font-medium"
                  data-testid="link-create-ticket"
                >
                  Create Ticket →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left font-medium py-2 flex justify-between items-center hover:text-nk-orange transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  {faq.question}
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div 
                    className="pt-2 text-gray-600 text-sm"
                    data-testid={`faq-answer-${index}`}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
