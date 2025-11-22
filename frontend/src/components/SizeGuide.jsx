import { Link } from 'react-router-dom';

function SizeGuide() {
  // Your actual size data (in inches)
  const sizeData = [
    { size: '4', waist: '24-26', hips: '35-37' },
    { size: '6', waist: '27-28', hips: '38-39' },
    { size: '8', waist: '29-30', hips: '40-41' },
    { size: '10', waist: '31-32', hips: '42-43' },
    { size: '12', waist: '33-34', hips: '44-45' },
    { size: '14', waist: '35-36', hips: '46-47' },
    { size: '16', waist: '37-38', hips: '48-49' },
    { size: '18', waist: '39-40', hips: '50-51' },
    { size: '20', waist: '41-42', hips: '52-55' },
    { size: '22', waist: '43-45', hips: '56-59' },
    { size: '24', waist: '46-48', hips: '60-63' },
    { size: '26', waist: '49-51', hips: '64-67' },
    { size: '28', waist: '52-55', hips: '68-71' },
    { size: '30', waist: '56-59', hips: '72-75' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      {/* Header */}
      <div className="bg-white border-b-4 shadow-md" style={{ borderColor: '#E85D45' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Shopping
          </Link>
          <h1 className="text-4xl font-bold" style={{ color: '#E85D45' }}>
            📏 Size Guide
          </h1>
          <p className="text-gray-600 mt-2">Find your perfect fit with Kadi Thrift</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Important Note */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 mb-8 border-2" style={{ borderColor: '#FFB6C1' }}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#E85D45' }}>
                Pre-Loved Fashion Note
              </h3>
              <p className="text-gray-700">
                Our items are vintage and pre-loved treasures! Sizes may vary slightly from modern standards. 
                <strong> We always include actual measurements in product descriptions.</strong> When in doubt, 
                message us on WhatsApp for specific measurements! 🐆
              </p>
            </div>
          </div>
        </div>

        {/* Size Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 mb-8" style={{ borderColor: '#C19A6B' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#E85D45' }}>
            👗 Women's Size Chart (inches)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: '#C19A6B', backgroundColor: '#F5F5DC' }}>
                  <th className="text-center py-4 px-6 font-bold text-lg" style={{ color: '#E85D45' }}>Size</th>
                  <th className="text-center py-4 px-6 font-bold text-lg" style={{ color: '#E85D45' }}>Natural Waist (inches)</th>
                  <th className="text-center py-4 px-6 font-bold text-lg" style={{ color: '#E85D45' }}>Hips (inches)</th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, index) => (
                  <tr 
                    key={row.size} 
                    className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-pink-50 transition-colors`}
                  >
                    <td className="py-4 px-6 text-center font-bold text-lg" style={{ color: '#E85D45' }}>
                      {row.size}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-800 font-semibold">
                      {row.waist}"
                    </td>
                    <td className="py-4 px-6 text-center text-gray-800 font-semibold">
                      {row.hips}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-700 text-center">
              <strong>📐 All measurements are in inches.</strong> Measure yourself and compare with the chart above.
            </p>
          </div>
        </div>

        {/* How to Measure Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 mb-8" style={{ borderColor: '#C19A6B' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#E85D45' }}>
            📐 How to Measure Yourself
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#F5F5DC' }}>
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#E85D45' }}>Natural Waist</h3>
              <p className="text-gray-700 text-left">
                <strong>1.</strong> Stand up straight and relax<br/>
                <strong>2.</strong> Find your natural waistline (usually the narrowest part, about 1-2 inches above your belly button)<br/>
                <strong>3.</strong> Wrap the measuring tape around your waist<br/>
                <strong>4.</strong> Keep the tape parallel to the floor<br/>
                <strong>5.</strong> Don't suck in or hold your breath!<br/>
                <strong>6.</strong> The tape should be snug but not tight
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#F5F5DC' }}>
              <div className="text-6xl mb-4">🍑</div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#E85D45' }}>Hips</h3>
              <p className="text-gray-700 text-left">
                <strong>1.</strong> Stand with your feet together<br/>
                <strong>2.</strong> Find the fullest part of your hips/buttocks<br/>
                <strong>3.</strong> This is usually about 7-9 inches below your natural waist<br/>
                <strong>4.</strong> Wrap the measuring tape around the fullest part<br/>
                <strong>5.</strong> Keep the tape parallel to the floor<br/>
                <strong>6.</strong> Make sure the tape isn't twisted
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: '#FFB6C1' }}>
            <h3 className="font-bold text-xl mb-3 text-white">💡 Pro Tip</h3>
            <p className="text-white text-lg">
              Take your measurements over thin clothing or underwear for the most accurate results!
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 mb-8" style={{ borderColor: '#FFB6C1' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#E85D45' }}>
            💡 Pro Tips for Thrift Shopping at Kadi Thrift
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">✅</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Check Product Measurements</h4>
                <p className="text-gray-700">Each listing includes actual measurements. Compare with your favorite pieces at home!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Ask Us on WhatsApp</h4>
                <p className="text-gray-700">Not sure about fit? Send us a message! We're happy to provide additional measurements or photos.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Vintage Sizing Varies</h4>
                <p className="text-gray-700">Older items may run smaller. A vintage size "10" might fit differently than a modern size "10".</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">💚</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Consider the Fabric</h4>
                <p className="text-gray-700">Stretchy materials (like jersey, spandex blends) offer more flexibility in fit than rigid fabrics (like denim, cotton).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
              <div className="text-2xl">📏</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Between Sizes?</h4>
                <p className="text-gray-700">If you're between two sizes, we recommend sizing up for a more comfortable fit, especially for vintage pieces.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Condition Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 mb-8" style={{ borderColor: '#C19A6B' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#E85D45' }}>
            ✨ Item Condition Guide
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-2 border-pink-300 bg-pink-50">
              <h3 className="font-bold text-lg mb-2" style={{ color: '#E85D45' }}>🆕 New/Like New</h3>
              <p className="text-gray-700">Unworn or barely worn, no visible signs of wear</p>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-orange-300 bg-orange-50">
              <h3 className="font-bold text-lg mb-2" style={{ color: '#E85D45' }}>💯 Good</h3>
              <p className="text-gray-700">Gently used, minor signs of wear but still in great condition</p>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50">
              <h3 className="font-bold text-lg mb-2" style={{ color: '#E85D45' }}>👌 Fair</h3>
              <p className="text-gray-700">Used with visible wear, all flaws clearly noted in description</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#E85D45' }}>
            Still Have Questions?
          </h3>
          <p className="text-gray-700 mb-6 text-lg">
            We're here to help you find the perfect fit! 🐆
          </p>
          <a
            href="https://wa.me/254705807643?text=Hi!%20I%20need%20help%20with%20sizing%20for%20Kadi%20Thrift"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all border-2 border-black text-lg"
            style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Chat with Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default SizeGuide;